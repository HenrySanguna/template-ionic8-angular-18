import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSkelStorage, StorageKey } from '../interfaces/storage';

/**
 * Servicio para gestión de almacenamiento local usando Capacitor Preferences.
 * Proporciona métodos tipados para guardar y recuperar datos del almacenamiento persistente.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Guarda un valor en el almacenamiento local
   * @param key Clave del almacenamiento (enum StorageKey)
   * @param value Valor a guardar
   * @returns Observable que se completa cuando el valor es guardado
   */
  set<K extends keyof AppSkelStorage>(
    key: K,
    value: AppSkelStorage[K]
  ): Observable<void> {
    return from(
      Preferences.set({
        key: key as string,
        value: JSON.stringify(value)
      })
    ).pipe(map(() => void 0));
  }

  /**
   * Obtiene un valor del almacenamiento local
   * @param key Clave del almacenamiento (enum StorageKey)
   * @returns Observable con el valor almacenado o null si no existe
   */
  get<K extends keyof AppSkelStorage>(
    key: K
  ): Observable<AppSkelStorage[K] | null> {
    return from(Preferences.get({ key: key as string })).pipe(
      map(result => {
        if (result.value) {
          try {
            return JSON.parse(result.value) as AppSkelStorage[K];
          } catch {
            return result.value as AppSkelStorage[K];
          }
        }
        return null;
      })
    );
  }

  /**
   * Elimina un valor específico del almacenamiento local
   * @param key Clave del almacenamiento a eliminar
   * @returns Observable que se completa cuando el valor es eliminado
   */
  remove(key: StorageKey): Observable<void> {
    return from(Preferences.remove({ key })).pipe(map(() => void 0));
  }

  /**
   * Limpia todo el almacenamiento local
   * @returns Observable que se completa cuando todo es eliminado
   */
  clear(): Observable<void> {
    return from(Preferences.clear()).pipe(map(() => void 0));
  }

  /**
   * Obtiene todas las claves almacenadas
   * @returns Observable con array de claves almacenadas
   */
  keys(): Observable<string[]> {
    return from(Preferences.keys()).pipe(
      map(result => result.keys)
    );
  }
}
